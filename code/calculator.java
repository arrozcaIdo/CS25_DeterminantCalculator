const EPS = 1e-10; 

function isSquareMatrix(A) {
  if (!Array.isArray(A) || A.length === 0) return false;
  const n = A.length;
  return A.every(row => Array.isArray(row) && row.length === n);
}

function validateMatrix(A) {
  if (!isSquareMatrix(A)) throw new Error("Input must be a non-empty square matrix");
  const n = A.length;
  if (n > 10) throw new Error("Matrix size n must be <= 10 for this cofactor implementation");
  // Ensure numeric entries
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (typeof A[i][j] !== 'number' || !isFinite(A[i][j])) {
        throw new Error(`Invalid numeric value at row ${i+1}, col ${j+1}`);
      }
    }
  }
  return n;
}

function minorMatrix(A, rowToRemove, colToRemove) {
  const n = A.length;
  const M = new Array(n - 1);
  let mi = 0;
  for (let i = 0; i < n; i++) {
    if (i === rowToRemove) continue;
    const row = new Array(n - 1);
    let mj = 0;
    for (let j = 0; j < n; j++) {
      if (j === colToRemove) continue;
      row[mj++] = A[i][j];
    }
    M[mi++] = row;
  }
  return M;
}

function determinant(A) {
  const n = validateMatrix(A);
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    const a = A[0][j];
    if (a === 0) continue; 
    const sign = (j % 2 === 0) ? 1 : -1;
    const minor = minorMatrix(A, 0, j);
    det += sign * a * determinant(minor);
  }
  return det;
}

function classifyMatrix(A) {
  const det = determinant(A);
  const classification = Math.abs(det) <= EPS ? "singular" : "non-singular";
  return { "The matrix determinant is:": det, "classification": classification };
}


//sample run to check if logic workzzzz
/*const example = [
  [2, 3, 1],
  [4, 1, -3],
  [0, 5, 2]
];
console.log(classifyMatrix(example));*/

const example = [
  [2, 3, 1, 5, 7],
  [4, 1, -3, 2, 9],
  [0, 5, 2, 1, 3],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1]
];
console.log(classifyMatrix(example)); //5x5 matrix test

//10x10 matrix test
const example10x10 = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
  [2, 1, 0, 1, 2, 3, 4, 5, 6, 7],
  [3, 2, 1, 0, 1, 2, 3, 4, 5, 6],
  [4, 3, 2, 1, 0, 1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1, 0, 1, 2, 3, 4],
  [6, 5, 4, 3, 2, 1, 0, 1, 2, 3],
  [7, 6, 5, 4, 3, 2, 1, 0, 1, 2],
  [8, 7, 6, 5, 4, 3, 2, 1, 0, 1]
];
console.log(classifyMatrix(example10x10));
