import axios from "axios"
const token = localStorage.getItem("token")

export const create = async (warehouse, supplier, customer, material, amount, transaction_type, editor, createdAt) => {
  try {
    const response = await axios.post("http://localhost:8000/stocks", {
      warehouse_id: warehouse,
      supplier_id: supplier,
      customer_id: customer,
      material_type_id: material,
      amount,
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