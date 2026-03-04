// Pure step generators for sorting algorithms
// Each returns an array of steps: { type, indices, array, description, sorted, pivot }

function snap(arr) {
  return [...arr];
}

export function bubbleSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sortedSet = new Set();

  steps.push({ type: "start", indices: [], array: snap(arr), sorted: [], pivot: -1, description: `Starting Bubble Sort on ${n} elements. Will repeatedly compare adjacent pairs.` });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: "compare", indices: [j, j + 1], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Comparing arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}` });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ type: "swap", indices: [j, j + 1], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Swapped! ${arr[j + 1]} > ${arr[j]} → moved ${arr[j + 1]} right` });
      }
    }
    sortedSet.add(n - i - 1);
    steps.push({ type: "sorted", indices: [n - i - 1], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Element ${arr[n - i - 1]} is now in its final position at index ${n - i - 1}` });
  }

  steps.push({ type: "done", indices: [], array: snap(arr), sorted: arr.map((_, i) => i), pivot: -1, description: `Bubble Sort complete! ${steps.filter(s => s.type === "compare").length} comparisons, ${steps.filter(s => s.type === "swap").length} swaps.` });
  return steps;
}

export function selectionSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sortedSet = new Set();

  steps.push({ type: "start", indices: [], array: snap(arr), sorted: [], pivot: -1, description: `Starting Selection Sort on ${n} elements. Finds minimum and places it at front.` });

  for (let i = 0; i < n; i++) {
    let minIdx = i;
    steps.push({ type: "pivot", indices: [i], array: snap(arr), sorted: [...sortedSet], pivot: i, description: `Pass ${i + 1}: Looking for minimum element starting from index ${i}` });

    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "compare", indices: [j, minIdx], array: snap(arr), sorted: [...sortedSet], pivot: i, description: `Comparing arr[${j}]=${arr[j]} with current min arr[${minIdx}]=${arr[minIdx]}` });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({ type: "newmin", indices: [j], array: snap(arr), sorted: [...sortedSet], pivot: i, description: `New minimum found: arr[${j}]=${arr[j]}` });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({ type: "swap", indices: [i, minIdx], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Swapping arr[${i}] and arr[${minIdx}] → placing ${arr[i]} at position ${i}` });
    }

    sortedSet.add(i);
    steps.push({ type: "sorted", indices: [i], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Position ${i} finalized with value ${arr[i]}` });
  }

  steps.push({ type: "done", indices: [], array: snap(arr), sorted: arr.map((_, i) => i), pivot: -1, description: `Selection Sort complete!` });
  return steps;
}

export function insertionSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  const sortedSet = new Set([0]);

  steps.push({ type: "start", indices: [], array: snap(arr), sorted: [0], pivot: -1, description: `Starting Insertion Sort on ${n} elements. First element is already "sorted".` });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    steps.push({ type: "pivot", indices: [i], array: snap(arr), sorted: [...sortedSet], pivot: i, description: `Picking up arr[${i}]=${key} to insert into sorted portion [0..${i - 1}]` });

    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      steps.push({ type: "compare", indices: [j, j - 1], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `arr[${j - 1}]=${arr[j - 1]} > ${key} → shifting right` });

      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      steps.push({ type: "swap", indices: [j, j - 1], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Shifted ${arr[j]} to index ${j}` });
      j--;
    }

    if (j > 0) {
      steps.push({ type: "compare", indices: [j, j - 1], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `arr[${j - 1}]=${arr[j - 1]} ≤ ${key} → insertion point found at index ${j}` });
    }

    sortedSet.add(i);
    steps.push({ type: "sorted", indices: [j], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Inserted ${key} at index ${j}. Sorted portion now [0..${i}]` });
  }

  steps.push({ type: "done", indices: [], array: snap(arr), sorted: arr.map((_, i) => i), pivot: -1, description: `Insertion Sort complete!` });
  return steps;
}

export function quickSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const sortedSet = new Set();

  steps.push({ type: "start", indices: [], array: snap(arr), sorted: [], pivot: -1, description: `Starting Quick Sort on ${arr.length} elements. Picks pivot, partitions, then recurses.` });

  function qs(lo, hi) {
    if (lo >= hi) {
      if (lo === hi) sortedSet.add(lo);
      return;
    }

    const pivotVal = arr[hi];
    steps.push({ type: "pivot", indices: [hi], array: snap(arr), sorted: [...sortedSet], pivot: hi, description: `Pivot selected: arr[${hi}]=${pivotVal}. Partitioning range [${lo}..${hi}]` });

    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "compare", indices: [j, i], array: snap(arr), sorted: [...sortedSet], pivot: hi, description: `Comparing arr[${j}]=${arr[j]} with pivot ${pivotVal}. Partition boundary at ${i}.` });

      if (arr[j] < pivotVal) {
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({ type: "swap", indices: [i, j], array: snap(arr), sorted: [...sortedSet], pivot: hi, description: `${arr[j]} < ${pivotVal} → swapped arr[${i}] and arr[${j}]` });
        }
        i++;
      }
    }

    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    sortedSet.add(i);
    steps.push({ type: "swap", indices: [i, hi], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Pivot ${pivotVal} placed at final position ${i}` });

    qs(lo, i - 1);
    qs(i + 1, hi);
  }

  qs(0, arr.length - 1);

  steps.push({ type: "done", indices: [], array: snap(arr), sorted: arr.map((_, i) => i), pivot: -1, description: `Quick Sort complete!` });
  return steps;
}

export function mergeSortSteps(inputArr) {
  const arr = [...inputArr];
  const steps = [];
  const sortedSet = new Set();

  steps.push({ type: "start", indices: [], array: snap(arr), sorted: [], pivot: -1, description: `Starting Merge Sort on ${arr.length} elements. Divides in half, sorts, then merges.` });

  function ms(lo, hi) {
    if (lo >= hi) return;

    const mid = Math.floor((lo + hi) / 2);
    steps.push({ type: "divide", indices: [lo, mid, hi], array: snap(arr), sorted: [...sortedSet], pivot: mid, description: `Dividing [${lo}..${hi}] at midpoint ${mid}` });

    ms(lo, mid);
    ms(mid + 1, hi);

    // Merge
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    steps.push({ type: "merge_start", indices: [lo, hi], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Merging [${lo}..${mid}] and [${mid + 1}..${hi}]` });

    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      steps.push({ type: "compare", indices: [lo + i, mid + 1 + j], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Comparing left[${i}]=${left[i]} with right[${j}]=${right[j]}` });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({ type: "place", indices: [k], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Placed ${left[i]} at index ${k} (from left half)` });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({ type: "place", indices: [k], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Placed ${right[j]} at index ${k} (from right half)` });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({ type: "place", indices: [k], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Placed remaining ${left[i]} at index ${k}` });
      i++; k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({ type: "place", indices: [k], array: snap(arr), sorted: [...sortedSet], pivot: -1, description: `Placed remaining ${right[j]} at index ${k}` });
      j++; k++;
    }
  }

  ms(0, arr.length - 1);

  steps.push({ type: "done", indices: [], array: snap(arr), sorted: arr.map((_, i) => i), pivot: -1, description: `Merge Sort complete!` });
  return steps;
}

export const SORTING_GENERATORS = {
  "Bubble Sort": bubbleSortSteps,
  "Selection Sort": selectionSortSteps,
  "Insertion Sort": insertionSortSteps,
  "Quick Sort": quickSortSteps,
  "Merge Sort": mergeSortSteps,
};
