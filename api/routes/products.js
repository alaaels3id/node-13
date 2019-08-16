const express = require('express');
const multer = require('multer');
const checkAuth = require('../../middleware/check-auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/') },
    filename: (req, file, cb) => { cb(null, Date.now() + file.originalname) }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
    else cb(null, false);
}

const upload = multer({
    storage: storage,
    //limits: { fileSize: 1024*1024*5 },
    fileFilter: fileFilter
});

const router = express.Router();

/** 
 *  Get all product
 */
router.get('/', ProductController.get_all_products);

/** 
 *  Create new product
 */
router.post('/', checkAuth, upload.single('productImage'), ProductController.create_new_product);

/** 
 *  Get the product by it's id
 */
router.get('/:productId', ProductController.get_product_by_id);

/** 
 *  Update the product by it's id
 */
router.patch('/:productId', checkAuth, ProductController.update_product);

/** 
 *  Delete the product by it's id
 */
router.delete('/:productId', checkAuth, ProductController.delete_product_by_id);

module.exports = router;