const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const search = "ea";
  const Products = await Product.find({}).sort("-name price");
  res.status(200).json({ Products, length: Products.length });
};

const getAllProducts = async (req, res) => {
  const { Featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (Featured) {
    queryObject.Featured = Featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  // console.log(queryObject);
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = {[operator]: Number(value)}
      }
    });
  }
  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }

  console.log(queryObject);
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // if page e.g equals 2
  // 2 -1 = 1
  // 1 * wat ever the limit is e.g 10 dat means skip = 10 so the code has to skip 10 items
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const Products = await result;
  res.status(200).json({ Products, length: Products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
