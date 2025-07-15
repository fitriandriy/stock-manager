import axios from "axios"
const token = localStorage.getItem("token")
const ENDPOINT = process.env.REACT_APP_API_URL;

export const create = async (warehouse, supplier, customer, material, amount, plateNumber, transaction_type, editor, createdAt) => {
  try {
    const response = await axios.post(`${ENDPOINT}/stocks`, {
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
    const response = await axios.post(`${ENDPOINT}/stocks/move`, {
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
    const response = await axios.get(`${ENDPOINT}/stocks/${warehouse}/${date}`, {
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
    const response = await axios.get(`${ENDPOINT}/suppliers`, {
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
    const response = await axios.get(`${ENDPOINT}/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const getWarehouses = async () => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`${ENDPOINT}/warehouses`, {
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
    const response = await axios.delete(`${ENDPOINT}/stocks/${id}`, {
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
    const response = await axios.get(`${ENDPOINT}/stocks/${date}`, {
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
    const response = await axios.get(`${ENDPOINT}/products/${warehouse}/${date}`, {
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
    const response = await axios.get(`${ENDPOINT}/products/data`, {
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
    const response = await axios.post(`${ENDPOINT}/products/add-stock`, {
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
    const response = await axios.post(`${ENDPOINT}/products`, {
      warehouse_id,
      product_id,
      product_transaction_id: 3,
      total,
      description: description,
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
    const response = await axios.delete(`${ENDPOINT}/products/${id}`, {
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
    const response = await axios.post(`${ENDPOINT}/products`, {
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
    const response = await axios.post(`${ENDPOINT}/products/move`, {
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
    const response = await axios.get(`${ENDPOINT}/products/report/${warehouse}/${date}`, {
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
    const response = await axios.get(`${ENDPOINT}/products/stock-products`, {
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
    const response = await axios.get(`${ENDPOINT}/material/rekap`, {
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
    const response = await axios.get(`${ENDPOINT}/products/production-process/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const getPurchases = async (month, year) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`${ENDPOINT}/purchases?month=${month}&year=${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  } catch (error) {
    alert(error)
  }
}

export const addCikIraPurchases = async (date, supplier_id, product_id, nominal) => {
  try {
    const response = await axios.post(`${ENDPOINT}/purchases`, {
      date,
      supplier_id,
      product_id,
      nominal
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

export const deletePurchaseData = async (id) => {
  try {
    const response = await axios.delete(`${ENDPOINT}/purchases/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    alert(error)
  }
}

export const getReturData = async(date) => {
  const token = localStorage.getItem("token")
  try {
    const response = await axios.get(`${ENDPOINT}/retur/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response
  } catch (error) {
    alert(error)
  }
}