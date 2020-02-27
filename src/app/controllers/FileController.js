import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const type = req.route.path === '/signaturefiles' ? 'signature' : 'avatar';

    const file = await File.create({
      name,
      path,
      type,
    });

    return res.json(file);
  }
}

export default new FileController();
