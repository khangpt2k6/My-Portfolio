// Pure step generators for tree traversal algorithms
// Returns array of steps: { type, nodeVal, highlighted: number[], current: number|null, description, stack/queue state }

export function generateTraversalSteps(root, traversalType) {
  if (!root) return [];

  const steps = [];
  const visited = [];

  steps.push({ type: "start", nodeVal: null, highlighted: [], current: null, traversalOrder: [], description: `Starting ${traversalType} traversal`, dataStructure: { label: traversalType === "Level-Order" ? "Queue" : "Call Stack", items: [] } });

  switch (traversalType) {
    case "In-Order": {
      const callStack = [];
      function inOrder(node) {
        if (!node) return;
        callStack.push(`inOrder(${node.val})`);
        steps.push({ type: "recurse", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Entering node ${node.val} — go left first`, dataStructure: { label: "Call Stack", items: [...callStack] } });

        inOrder(node.left);

        steps.push({ type: "visit", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Left subtree of ${node.val} done → visit ${node.val}`, dataStructure: { label: "Call Stack", items: [...callStack] } });
        visited.push(node.val);
        steps.push({ type: "add_result", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Added ${node.val} to result: [${visited.join(", ")}]`, dataStructure: { label: "Call Stack", items: [...callStack] } });

        inOrder(node.right);
        callStack.pop();
      }
      inOrder(root);
      break;
    }
    case "Pre-Order": {
      const callStack = [];
      function preOrder(node) {
        if (!node) return;
        callStack.push(`preOrder(${node.val})`);

        steps.push({ type: "visit", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Visit ${node.val} first (pre-order), then go to children`, dataStructure: { label: "Call Stack", items: [...callStack] } });
        visited.push(node.val);
        steps.push({ type: "add_result", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Added ${node.val} to result: [${visited.join(", ")}]`, dataStructure: { label: "Call Stack", items: [...callStack] } });

        if (node.left) {
          steps.push({ type: "recurse", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Going to left child of ${node.val}`, dataStructure: { label: "Call Stack", items: [...callStack] } });
        }
        preOrder(node.left);

        if (node.right) {
          steps.push({ type: "recurse", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Going to right child of ${node.val}`, dataStructure: { label: "Call Stack", items: [...callStack] } });
        }
        preOrder(node.right);
        callStack.pop();
      }
      preOrder(root);
      break;
    }
    case "Post-Order": {
      const callStack = [];
      function postOrder(node) {
        if (!node) return;
        callStack.push(`postOrder(${node.val})`);
        steps.push({ type: "recurse", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Entering node ${node.val} — process children first`, dataStructure: { label: "Call Stack", items: [...callStack] } });

        postOrder(node.left);
        postOrder(node.right);

        steps.push({ type: "visit", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Both children of ${node.val} done → visit ${node.val}`, dataStructure: { label: "Call Stack", items: [...callStack] } });
        visited.push(node.val);
        steps.push({ type: "add_result", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Added ${node.val} to result: [${visited.join(", ")}]`, dataStructure: { label: "Call Stack", items: [...callStack] } });
        callStack.pop();
      }
      postOrder(root);
      break;
    }
    case "Level-Order": {
      const queue = [root];
      const queueVals = [root.val];

      while (queue.length > 0) {
        const node = queue.shift();
        queueVals.shift();

        steps.push({ type: "visit", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Dequeued ${node.val}. Processing...`, dataStructure: { label: "Queue", items: [...queueVals] } });

        visited.push(node.val);
        steps.push({ type: "add_result", nodeVal: node.val, highlighted: [...visited], current: node.val, traversalOrder: [...visited], description: `Added ${node.val} to result: [${visited.join(", ")}]`, dataStructure: { label: "Queue", items: [...queueVals] } });

        if (node.left) {
          queue.push(node.left);
          queueVals.push(node.left.val);
          steps.push({ type: "enqueue", nodeVal: node.left.val, highlighted: [...visited], current: null, traversalOrder: [...visited], description: `Enqueued left child ${node.left.val}`, dataStructure: { label: "Queue", items: [...queueVals] } });
        }
        if (node.right) {
          queue.push(node.right);
          queueVals.push(node.right.val);
          steps.push({ type: "enqueue", nodeVal: node.right.val, highlighted: [...visited], current: null, traversalOrder: [...visited], description: `Enqueued right child ${node.right.val}`, dataStructure: { label: "Queue", items: [...queueVals] } });
        }
      }
      break;
    }
  }

  steps.push({ type: "done", nodeVal: null, highlighted: [...visited], current: null, traversalOrder: [...visited], description: `${traversalType} traversal complete! Result: [${visited.join(", ")}]`, dataStructure: { label: "", items: [] } });

  return steps;
}
