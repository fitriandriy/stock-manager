import axios from "axios"
const token = localStorage.getItem("token")

export const create = async (warehouse, supplier, customer, material, amount, plateNumber, transaction_type, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/stocks", {
      warehouse_id: warehouse,
      supplier_id: supplier,
      customer_id: customer,
      material_type_id: material,
      amount,
      plate_number: plateNumber,
      transaction_type_id: transaction_type,
      editor_id: editor,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const moveStock = async (warehouse, destination, material, amount, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/stocks/move", {
      warehouse_id: warehouse,
      destination,
      material_type_id: material,
      amount,
      editor_id: editor,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const getData = async (warehouse, date) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`http://localhost:8000/stocks/${warehouse}/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
};

export const getSuppliers = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get("http://localhost:8000/suppliers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const getCustomers = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get("http://localhost:8000/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const deleteStock = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/stocks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const getReports = async (date) => {
  try {
    const response = await axios.get(`http://localhost:8000/stocks/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

// Stok Product
export const getStockProducts = async (warehouse, date) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`http://localhost:8000/products/${warehouse}/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
};

export const getProducts = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get("http://localhost:8000/products/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const addStockProduct = async (warehouse_id, product_id, total, description, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/products/add-stock", {
      warehouse_id,
      product_id,
      product_transaction_id: 1,
      total,
      description,
      editor,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const addReduceStock = async (warehouse_id, product_id, total, description, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/products", {
      warehouse_id,
      product_id,
      product_transaction_id: 3,
      total,
      description: "Giling untuk PS",
      editor,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const deleteStockProduct = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8000/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const addPurchase = async (warehouse_id, product_id, total, description, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/products", {
      warehouse_id,
      product_id,
      product_transaction_id: 2,
      total,
      description,
      editor,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const moveStockProduct = async (warehouse, destination, product, amount, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/products/move", {
      warehouse_id: parseInt(warehouse),
      destination: parseInt(destination),
      product_id: parseInt(product),
      total: parseInt(amount),
      editor_id: editor,
      createdAt
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const getProductReports = async (warehouse, date) => {
  try {
    const response = await axios.get(`http://localhost:8000/products/report/${warehouse}/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const getProductStockReport = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`http://localhost:8000/products/stock-products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const getHasilProduksi = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`http://localhost:8000/material/rekap`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const getProductionProcessReport = async (date) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`http://localhost:8000/products/production-process/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
}

// fullskills
export const getFullskillByMonth = async (month) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`http://localhost:8000/fullskill`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        month,
        warehouse_id: 6
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const addFullskill = async (date, f1, f2, editor_id) => {
  try {
    const response = await axios.post("http://localhost:8000/fullskill", {
      warehouse_id: 6,
      f1,
      f2,
      date,
      editor_id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}