figma.showUI(__html__, {
  width: 480,
  height: 640,
  themeColors: true
});

// --- Selection helpers ---

function collectTextNodes(node) {
  var results = [];
  if (node.type === "TEXT") {
    results.push({
      name: node.name,
      width: node.width,
      height: node.height,
      characters: node.characters.length,
      absoluteBoundingBox: node.absoluteBoundingBox
    });
  }
  if ("children" in node) {
    for (var i = 0; i < node.children.length; i++) {
      results = results.concat(collectTextNodes(node.children[i]));
    }
  }
  return results;
}

function countChildren(node) {
  var count = 0;
  if ("children" in node) {
    for (var i = 0; i < node.children.length; i++) {
      count += 1 + countChildren(node.children[i]);
    }
  }
  return count;
}

function getFrameInfo(node) {
  var textNodes = collectTextNodes(node);

  var frameBox = node.absoluteBoundingBox;
  var frameArea = node.width * node.height;

  // Calculate text area as the sum of text bounding box areas,
  // clipped to the frame bounds so text outside the frame doesn't count.
  var textArea = 0;
  for (var i = 0; i < textNodes.length; i++) {
    var tb = textNodes[i].absoluteBoundingBox;
    if (tb && frameBox) {
      var clippedLeft = Math.max(tb.x, frameBox.x);
      var clippedTop = Math.max(tb.y, frameBox.y);
      var clippedRight = Math.min(tb.x + tb.width, frameBox.x + frameBox.width);
      var clippedBottom = Math.min(tb.y + tb.height, frameBox.y + frameBox.height);
      var clippedWidth = Math.max(0, clippedRight - clippedLeft);
      var clippedHeight = Math.max(0, clippedBottom - clippedTop);
      textArea += clippedWidth * clippedHeight;
    }
  }

  var textAreaPercent = frameArea > 0 ? (textArea / frameArea) * 100 : 0;

  // Check text positions relative to frame for safe zone analysis
  var textPositions = [];
  for (var j = 0; j < textNodes.length; j++) {
    var tn = textNodes[j];
    var box = tn.absoluteBoundingBox;
    if (box && frameBox) {
      textPositions.push({
        name: tn.name,
        relativeTop: box.y - frameBox.y,
        relativeBottom: (box.y + box.height) - frameBox.y,
        relativeLeft: box.x - frameBox.x,
        relativeRight: (box.x + box.width) - frameBox.x
      });
    }
  }

  return {
    name: node.name,
    type: node.type,
    width: Math.round(node.width),
    height: Math.round(node.height),
    childCount: countChildren(node),
    textNodeCount: textNodes.length,
    textAreaPercent: Math.round(textAreaPercent * 10) / 10,
    textPositions: textPositions,
    frameHeight: node.height
  };
}

function sendSelectionInfo() {
  var selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ type: "selection", data: null });
    return;
  }

  var node = selection[0];

  // Only allow frames, components, component sets, and instances
  var validTypes = ["FRAME", "COMPONENT", "COMPONENT_SET", "INSTANCE", "GROUP"];
  if (validTypes.indexOf(node.type) === -1) {
    figma.ui.postMessage({
      type: "selection",
      data: null,
      reason: "Select a frame, component, or group."
    });
    return;
  }

  var info = getFrameInfo(node);
  figma.ui.postMessage({ type: "selection", data: info });
}

// --- Event listeners ---

figma.on("selectionchange", function () {
  sendSelectionInfo();
});

// Send initial selection on load
sendSelectionInfo();

// --- Message handler ---

figma.ui.onmessage = function (message) {
  if (message.type === "request-selection") {
    sendSelectionInfo();
  }

  if (message.type === "notify") {
    figma.notify(message.message);
  }

  if (message.type === "close") {
    figma.closePlugin();
  }
};
