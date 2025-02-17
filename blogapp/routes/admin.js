const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model("categorias")

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req, res) => {
    // Listando todas os documentos
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        console.log(categorias)

        // "Limpa" os dados e cria um novo objeto simples para passar para o Handlebars
        const categoriasSimples = categorias.map(categoria => ({
            nome: categoria.nome,
            slug: categoria.slug,
            date: categoria.date
        }));

        res.render("admin/categorias", { categorias: categoriasSimples })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})


router.post('/categorias/nova', (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "nome inválido"})
    }

    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "slug inválido"})
    }

    if (req.body.nome.length <2 ) {
        erros.push({texto: "Nome da categoria é muito pequeno!"})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', "categoria criada com sucesso!")
            res.redirect('/admin/categorias')
        }).catch((erro) => {
            req.flash('error_msg', "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect('/admin')
        })
    }
})

module.exports = router