const {
    product,
    user,
    producttransaction,
    category,
    cart,
    transaction,
    profile,
  } = require("../../models");
  
  const cloudinary = require("../utils/cloudinary");
  
  exports.addProduct = async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "waysbeans",
        use_filename: true,
        unique_filename: false,
      });
  
      const { ...data } = req.body;
    
  
      const newProduct = await product.create({
        ...data,
        image: req.file.filename|| result.public_id,
        idUser: req.user.id,
      });
  
      
      let productData = await product.findOne({
        where: {
          id: newProduct.id,
        },
        include: [
          {
            model: user,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      });
  
      // code here
      productData = JSON.parse(JSON.stringify(productData));
      res.send({
        staus: "success",
        data: {
          ...productData,
          image: process.env.PATH_FILE + productData.image,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server Error",
      });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    try {
      let products = await product.findAll({
        include: [
          {
            model: user,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      });
      products = JSON.parse(JSON.stringify(products));
      products = products.map((item) => {
        return {
          ...item,
          image: process.env.PATH_FILE + item.image,
        };
      });
      res.send({
        status: "success...",
        data: {
          products: products,
        },
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
  };
  
  exports.getProduct = async (req, res) => {
    try {
      const { id } = req.params;
      let productData = await product.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      productData = JSON.parse(JSON.stringify(productData));
  
      res.send({
        status: "success",
        data: {
          ...productData,
          image: process.env.PATH_FILE + productData.image,
        },
      });
    } catch (error) {}
  };
  
  exports.updateProduct = async (req, res) => {
    // code here
    try {
      const id = req.params.id;
      const data = {
        name: req?.body?.name,
        desc: req?.body?.desc,
        price: req?.body?.price,
        image: req?.file?.filename,
        qty: req?.body?.qty,
      };
  
      await product.update(data, {
        where: {
          id,
        },
      });
  
      res.send({
        status: "success",
        message: `Update successfull for product with id: ${id}`,
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
  };
  
  exports.deleteProduct = async (req, res) => {
    // code here
    try {
      const { id } = req.params;
  
      await cart.destroy({
        where: {
          idProduct: id,
        },
      });

      await producttransaction.destroy({
        where: {
          idProduct: id,
        },
      });
  
      await product.destroy({
        where: {
          id,
        },
      });
  
      res.send({
        status: "success",
        message: `Delete product with id:${id} finished`,
      });
    } catch (error) {
      console.log(error);
      res.send({
        status: "failed",
        message: "Server Error",
      });
    }
  };