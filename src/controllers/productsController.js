const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = require ('../utils/toThousand')
const toDiscount = require ('../utils/toDiscount')

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products', {
			products : JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','productsDataBase.json'),'utf-8')),
			toDiscount,
			toThousand
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		return res.render ('detail', {
			product : products.find (product => product.id === +req.params.id),
			toDiscount,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name, price, discount, category, description} = req.body;

		let product = {
			id: products[products.length - 1].id + 1,
            name: name.trim(),
            price: +price,
            discount: +discount,
            category,
            description: description.trim(),
            image: 'default-image.png',
		}
		products.push(product)
		fs.writeFileSync(path.join(__dirname, '..', 'data', 'productsDataBase.json'), JSON.stringify(products,null,3), 'utf-8')
		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		return res.render('product-edit-form', {
			product : products.find(product => product.id === +req.params.id)
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name, price, discount, category, description} = req.body;
		let product = products.find(product => product.id === +req.params.id)

		let productModified = {
			id: +req.params.id,
            name: name.trim(),
            price: +price,
            discount: +discount,
            category: product.category,
            description: description.trim(),
            image: product.image
		}
		let productsModified = products.map(product => product.id === +req.params.id ? productModified : product)
		products.push(product)
		fs.writeFileSync(path.join(__dirname, '..', 'data', 'productsDataBase.json'), JSON.stringify(productsModified,null,3), 'utf-8')
		return res.redirect('/products')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productsModified = products.filter(product => product.id !== +req.params.id)
		fs.writeFileSync(path.join(__dirname, '..', 'data', 'productsDataBase.json'), JSON.stringify(productsModified,null,3), 'utf-8')
		res.redirect('/products')
	}
};

module.exports = controller;