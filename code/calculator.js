const EPS = 1e-10; 

// separated the program into 2 parts (1) logic, (2) UI
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
  return { "The matrix determinant is:": det, "classification:": classification };
}

//sample run to check if logic workzzzz
/*const example = [
  [2, 3, 1],
  [4, 1, -3],
  [0, 5, 2]
];
console.log(classifyMatrix(example));*/

// UI, for easier html implementation
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateMatrix");
  const matrixSizeInput = document.getElementById("matrixSize");
  const matrixInputsDiv = document.getElementById("matrixInputs");
  const calculateBtn = document.getElementById("calculateDet");
  const resetBtn = document.getElementById("resetMatrix");
  const consoleArea = document.getElementById("console");
  
  generateBtn.addEventListener("click", () => {
    const n = parseInt(matrixSizeInput.value);
    if (!n || n < 2 || n > 10) {
      alert("Please enter a number between 2 and 10.");
      return;
    }

    matrixInputsDiv.innerHTML = "";
    consoleArea.style.display = "none"; // hide results until calculate
    consoleArea.value = "";

    // calculate button
    calculateBtn.style.display = "inline-block";
    resetBtn.style.display = "inline-block";

    for (let i = 0; i < n; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "matrix-row";
      for (let j = 0; j < n; j++) {
        const input = document.createElement("input");
        input.type = "number";
        input.className = "matrix-input";
        input.id = `cell-${i}-${j}`;
        rowDiv.appendChild(input);
      }
      matrixInputsDiv.appendChild(rowDiv);
    }

    // for label, coded here instead sa html/css cuz it depends on user input
    const matrixLabel = document.createElement("p");
    matrixLabel.id = "matrixLabel";
    matrixLabel.textContent = `${n} x ${n} Matrix`;
    matrixLabel.style.fontWeight = "bold";  
    matrixLabel.style.marginTop = "10px"; 
    matrixInputsDiv.appendChild(matrixLabel);
  });


  calculateBtn.addEventListener("click", () => {
    const n = parseInt(matrixSizeInput.value);
    if (!n) return;

    const matrix = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        const value = parseFloat(document.getElementById(`cell-${i}-${j}`).value);
        if (isNaN(value)) {
          alert("Please fill all matrix fields.");
          return;
        }
        row.push(value);
      }
      matrix.push(row);
    }

    try {
      const result = classifyMatrix(matrix);
       consoleArea.style.display = "block"; // show results txtarea
      consoleArea.value = "";
      for (const key in result) {
        consoleArea.value += `${key} ${result[key]}\n`;
      }
    } catch (err) {
      alert(err.message);
    }
  });

  resetBtn.addEventListener("click", () => {
    matrixInputsDiv.innerHTML = "";
    consoleArea.style.display = "none";
    consoleArea.value = "";
    matrixSizeInput.value = "";
    calculateBtn.style.display = "none";
    resetBtn.style.display = "none";
  });
});
