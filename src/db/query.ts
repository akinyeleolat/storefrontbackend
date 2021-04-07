// Create User
const createUser = "insert into users (firstName, lastName, email, password) values ($1, $2, $3, $4) returning *";

// Return all users
const getAllUsers = "select id, firstname, lastname, email from users";

// Return user by id
const getUserById = "select id, firstname, lastname, email from users where id = $1";

// Return user by email
const getUserByEmail = "select id, firstname, lastname, email, password from users where email = $1";

// Create Category
const createCategory = "insert into categories (name, notes) values ($1, $2) returning *";

// Return categories
const returnCategories = "select * from categories";

// Update category
const updateCategory = "update categories set name=$2, notes=$3 where id=$1 returning *";

// Delete category
const deleteCategory = "delete from categories where id=$1";

// Create Product
const createProduct = "insert into products (name, price, categoryid) values ($1, $2, $3) returning *";

// Return Products
const returnProducts = "select * from products";

// Return Product
const returnProduct = "select * from products where id = $1";

// Return Product by category
const returnProductByCategory = "select * from products where categoryid = $1";

// Create Order
const createOrder = "insert into orders (user_id, order_status) values ($1, $2) returning *";

const createOrderProduct = "insert into orderproducts (user_id, orderid, productid, productqty) values ($1, $2, $3, $4) returning *";

// Return Order
const returnOrderByUser = "select * from orders left join orderproducts on orders.user_id=$1 where order_status=$2";

export {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  createCategory,
  deleteCategory,
  updateCategory,
  returnCategories,
  createProduct,
  returnProducts,
  returnProduct,
  returnProductByCategory,
  createOrder,
  createOrderProduct,
  returnOrderByUser,
};
