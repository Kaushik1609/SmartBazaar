import Product from '../models/Product.js';

// @desc    Get all products for a specific vendor
// @route   GET /api/products?vendorId=xxx
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const { vendorId } = req.query;
        let query = {};
        if (vendorId) {
            query.vendor = vendorId;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
export const createProduct = async (req, res) => {
    try {
        const { name, price, stock, category, weight, imageUrl } = req.body;

        const product = new Product({
            vendor: req.user._id,
            name,
            price,
            stock,
            category,
            weight,
            imageUrl
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
export const updateProduct = async (req, res) => {
    try {
        const { name, price, stock, category, weight, imageUrl } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if vendor owns this product
            if (product.vendor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized to update this product' });
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.stock = stock !== undefined ? stock : product.stock;
            product.category = category || product.category;
            product.weight = weight || product.weight;
            product.imageUrl = imageUrl || product.imageUrl;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if vendor owns this product
            if (product.vendor.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized to delete this product' });
            }
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
