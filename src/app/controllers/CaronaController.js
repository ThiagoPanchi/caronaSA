import * as Yup from "yup";

import Carona from "../models/Carona";
import Instituicao from "../models/Instituicao";
import Usuario from "../models/Usuario";

class CaronaController {
  async show(req, res) {
    const { id } = req.params;

    const carona = await Carona.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["nome", "telefone"]
        }
      ],
      attributes: ["id", "desc_carro", "periodo", "dias"]
    });

    return res.json(carona);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_instituicao: Yup.number().required(),
      desc_carro: Yup.string().required(),
      periodo: Yup.string().required(),
      dias: Yup.array().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(200).json({ erro: "Validação falhou" });
    }

    const instituicao = await Instituicao.findByPk(req.body.id_instituicao);

    if (!instituicao) {
      return res.status(200).json({ erro: "Instituição não encontrada" });
    }

    const carona = await Carona.create({
      id_usuario: req.idUsuario,
      ...req.body
    });

    return res.json(carona);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_instituicao: Yup.number().required(),
      desc_carro: Yup.string().required(),
      periodo: Yup.string().required(),
      dias: Yup.mixed().required(),
      disponivel: Yup.boolean().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(200).json({ erro: "Validação falhou" });
    }

    const carona = await Carona.findByPk(req.params.id);

    if (carona.id_usuario !== req.idUsuario) {
      return res.status(200).json({ erro: "Acesso negado" });
    }

    const instituicao = await Instituicao.findByPk(req.body.id_instituicao);

    if (!instituicao) {
      return res.status(200).json({ erro: "Instituição não encontrada" });
    }

    await carona.update(req.body);

    return res.json({ mensagem: "Carona atualizada" });
  }

  async delete(req, res) {
    const { id } = req.params;

    const carona = await Carona.findByPk(id);

    if (carona.id_usuario !== req.idUsuario) {
      return res.status(200).json({ erro: "Acesso negado" });
    }

    await carona.destroy();

    return res.json({ mensagem: "Carona exlcuida" });
  }
}

export default new CaronaController();
