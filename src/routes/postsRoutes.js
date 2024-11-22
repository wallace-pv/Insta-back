import express from "express";
import multer from "multer";
import cors from "cors";
const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
//import path from 'path';
// Configura o armazenamento do Multer para salvar os arquivos em 'uploads/'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define o diretório de destino como 'uploads/'
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Mantém o nome original do arquivo
        cb(null, file.originalname);
    }
});

// Cria uma instância do Multer com a configuração de armazenamento definida
const upload = multer({ dest: "./uploads" , storage}) 

// Define as rotas da aplicação
const routes = (app) => {
    
    // Configura o middleware para analisar o corpo das requisições como JSON
    app.use(express.json());
    app.use(cors(corsOptions));

    // Define a rota GET /posts para buscar todos os posts
    app.get("/posts", listarPosts );
    
    // Define a rota POST /posts para criar um novo post
    app.post("/posts", postarNovoPost );

    // Define a rota POST /upload para fazer upload de uma imagem
    app.post("/upload", upload.single("imagem"), uploadImagem );

    app.put("/upload/:id", atualizarNovoPost); 

 };

export default routes;