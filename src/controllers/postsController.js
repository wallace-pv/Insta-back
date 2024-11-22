import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiServices.js";
export async function listarPosts( req, res) {
    // Chama a função getTodosPosts para buscar os posts do banco de dados
    const posts = await getTodosPosts();
    // Retorna os posts com status 200 (OK)
    res.status(200).json(posts);
}
  
export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    }catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
    
}

export async function uploadImagem(req, res) {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imageAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imageAtualizada);
        res.status(200).json(postCriado);
    }catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
    
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImage = `http://localhost:3000/${id}.png`;
    
  
  try {
      const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
      const descricao = await gerarDescricaoComGemini(imageBuffer);
      const post = {
      imgUrl: urlImage,
      descricao: descricao,
      alt: req.body.alt
    }

      const postCriado = await atualizarPost(id, post);
      res.status(200).json(postCriado);
  }catch(erro) {
      console.error(erro.message);
      res.status(500).json({"Erro":"Falha na requisição"});
  }
  
}
