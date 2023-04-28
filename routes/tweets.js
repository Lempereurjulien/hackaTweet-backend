var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweets");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  console.log("test");
});

router.post("/tweet", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (!checkBody(req.body, ["tweet"])) {
    res.json({ result: false, error: "You forgot to write something !" });
    return;
  }
  // Cherche un compte via son token, si la personne est connectée son tweet sera crée, sinon, un message lui disant d'en créer un s'affichera
  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      console.log(data, "c la data");
      const newTweet = new Tweet({
        user: data._id,
        tweet: req.body.tweet,
        date: new Date(),
        like: [],
      });

      newTweet.save().then((newTweet) => {
        res.json({ result: true, Tweet: newTweet });
      });
    } else {
      res.json({ result: false, error: "You need to be connected" });
    }
  });
});

router.get("/tweet/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) {
      Tweet.find()
        .populate("user")
        .then((data) => res.json({ result: true, tweet: data }));
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Tweet.deleteOne({
    _id: req.params.id,
  }).then((result) => {
    res.status(200).json({
      message: "Tweet deleted!",
      result: result,
    });
  });
});

router.get("/delete", (req, res) => {
  Tweet.deleteMany().then(() => console.log("database clear"));
});

module.exports = router;
//
