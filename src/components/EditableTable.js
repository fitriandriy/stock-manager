import { useRef } from "react";
import { Plus, Minus } from "lucide-react";

export default function EditableTable({ data, onDataChange, columns }) {
  const inputsRef = useRef([]);

  const handleChange = (rowIndex, field, value) => {
    const newData = [...data];
    newData[rowIndex][field] = value;
    onDataChange(newData);
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    const numRows = data.length;
    const numCols = columns.length;
    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (e.key) {
      case "ArrowDown":
        nextRow = Math.min(rowIndex + 1, numRows - 1);
        break;
      case "ArrowUp":
        nextRow = Math.max(rowIndex - 1, 0);
        break;
      case "ArrowLeft":
        nextCol = Math.max(colIndex - 1, 0);
        break;
      case "ArrowRight":
        nextCol = Math.min(colIndex + 1, numCols - 1);
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextInput = inputsRef.current[nextRow * numCols + nextCol];
    nextInput?.focus();
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.key] = col.key === "NO" ? data.length + 1 : "";
    });
    onDataChange([...data, newRow]);
  };

  const handleRemoveRow = () => {
    if (data.length > 1) {
      onDataChange(data.slice(0, -1));
    }
  };

  return (
    <div className="mx-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">📋 Input Daily Retur</h2>
        <div className="flex gap-4 text-gray-700">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            <Plus size={16} /> Tambah Baris
          </button>
          <button
            onClick={handleRemoveRow}
            className="flex items-center gap-1 hover:text-red-600"
          >
            <Minus size={16} /> Hapus Baris
          </button>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="h-[70vh] overflow-y-auto border rounded-lg">
        <table className="min-w-full border-collapse border text-sm table-fixed max-h-[100vh]">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="border p-2 text-center bg-blue-1 text-[white]"
                >
                  {col.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={col.key} className="border p-1">
                    {col.key === "NO" ? (
                      <div className="text-center py-1 bg-gray-50">
                        {row[col.key]}
                      </div>
                    ) : (
                      <input
                        ref={(el) =>
                          (inputsRef.current[rowIndex * columns.length + colIndex] =
                            el)
                        }
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          handleChange(rowIndex, col.key, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        className="w-full outline-none p-1 text-center"
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
