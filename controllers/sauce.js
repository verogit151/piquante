const Sauce = require('../models/Sauce');
const fs = require('fs');

//Ajout d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

//Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce); })
        .catch((error) => { res.status(404).json({ error }); });
};
  
//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée!'}))
                    .catch(error => res.status(400).json({ error }));
                });
            })
        .catch((error) => res.status(500).json({ error }));
};

//Affichage des sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({ error });
      }
    );
};

//like ou dislike la sauce
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            switch (like) {
                case 1 : //like la sauce
                    //Vérification de l'absence de l'utilisateur dans le tableau des likes
                    if (sauce.usersLiked.indexOf(userId) === -1) {
                        if (sauce.usersDisliked.indexOf(userId) > -1) { 
                            // suppression du tableau des dislikes si présent 
                            sauce.dislikes --;
                            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                        }
                        sauce.usersLiked.push(userId);
                        sauce.likes ++;
                        const sauceObject = { ...sauce._doc, };
                        Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    else return res.status(405).send(new Error('Not allowed!'));
                    break;
                case -1 : //disike la sauce
                    //Vérification de l'absence de l'utilisateur dans le tableau des dislikes
                    if (sauce.usersDisliked.indexOf(userId) === -1) { 
                        if (sauce.usersLiked.indexOf(userId) > -1) {
                            // suppression du tableau des likes si présent
                            sauce.likes --;
                            sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                        }
                        sauce.usersDisliked.push(userId);
                        sauce.dislikes ++;
                        const sauceObject = { ...sauce._doc, };
                        Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    else return res.status(405).send(new Error('Not allowed!'));
                    break;
                case 0 : 
                    //suppression du like sinon dislike
                    if (sauce.usersLiked.indexOf(userId) > -1) {
                        sauce.likes --;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                    }
                    else if (sauce.usersDisliked.indexOf(userId) > -1) {
                        sauce.dislikes --;
                        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
                    }
                    else return res.status(405).send(new Error('Not allowed!'));
                    const sauceObject = { ...sauce._doc, };
                    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default : res.status(500).json({ error });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};