const { firebaseApp, Auth, Users } = require("../config/dbConnect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  static Register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const snapshot = await Auth.where("email", "==", email).get();
      if (snapshot.size != 0) {
        res.send({
          message: "Email Already Exist",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const data = await Auth.add({
          email: email,
          password: hashPassword,
        });

        const token = jwt.sign({ id: data.id }, process.env.SCRET_KEY);

        res.send({
          message: "Register",
          token: token,
        });
      }
    } catch (e) {
      res.send({
        message: "Something wrong",
      });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const snapshot = await Auth.where("email", "==", email).get();
      if (snapshot.size != 0) {
        const list = snapshot.docs.map((doc) => doc.data());
        const pass = list[0]["password"];
        const passMatch = await bcrypt.compare(password, pass);

        if (passMatch) {
          const id = snapshot.docs.map((doc) => doc.id);
          const token = jwt.sign({ id: id[0] }, process.env.SCRET_KEY);
          const isExist = await Users.where("idd", "==", id[0]).get();

          if (isExist.size == 0) {
            res.send({
              message: 1,
              token: token,
              isExist: false,
            });
          } else {
            res.send({
              message: 2,
              token: token,
              isExist: true,
            });
          }
        } else {
          res.send({
            message: 3,
          });
        }
      } else {
        res.send({
          message: 3,
        });
      }
    } catch (e) {
      res.send({
        message: 4,
      });
    }
  };

  static Detail = async (req, res) => {
    const { idd, userid, name, city, country } = req.body;
    try {
      const useridExist = await Users.where("userid", "==", userid).get();
      if (useridExist.size == 0) {
        const data = await Users.add({
          idd: idd,
          userid: userid,
          name: name,
          city: city,
          country: country,
        });
        res.send({
          message: "Welcome to dashboard",
        });
      } else {
        res.send({
          message: "Userid not available",
        });
      }
    } catch (e) {
      res.send({
        message: "Something wrong",
      });
    }
  };

  static getDetails = async (req, res) => {
    const { idd } = req.body;
    try {
      let snapshot = await Users.where("idd", "==", idd).get();
      const list = snapshot.docs.map((doc) => doc.data());
      if (list.size != 0) {
        res.send({ message: "success", data: list });
      } else {
        res.send({
          message: "Something wrong",
        });
      }
    } catch (e) {
      res.send({
        message: "Something wrong",
      });
    }
  };

  static passwordReset = async (req, res) => {
    const { idd, oldpass, newpass } = req.body;
    try {
      const isExist = await Auth.doc(idd).get();
      if (isExist.data() != null) {
        const passMatch = await bcrypt.compare(
          oldpass,
          isExist.data().password
        );
        console.log(passMatch);
        if (passMatch) {
          const salt = await bcrypt.genSalt(10);
          const hashnewPass = await bcrypt.hash(newpass, salt);
          Auth.doc(idd).update({
            password: hashnewPass,
          });
          res.send({
            message: "Password is Changed",
          });
        } else {
          res.send({
            message: "Old password is wrong",
          });
        }
      } else {
        res.send({
          message: "Something wrong",
        });
      }
    } catch (e) {
      console.log(e.message);
      res.send({
        message: "Something wrong",
      });
    }
  };

  static deleteAcc = async (req, res) => {
    const { idd } = req.body;
    try {
      const isExist = await Auth.doc(idd).get();
      if (isExist.data() != null) {
        Auth.doc(idd).delete();

        const snapshot = await Users.where("idd", "==", idd).get();
        const id = snapshot.docs.map((doc) => doc.id);
        Users.doc(id[0]).delete();

        res.send({
          message: "Deleted",
        });
      } else {
        res.send({
          message: "Something wrong",
        });
      }
    } catch (e) {
      res.send({
        message: "Something wrong",
      });
    }
  };

  static updateDetails = async (req, res) => {
    const { idd, userid, name, city, country } = req.body;
    try {
      const isExist = await Auth.doc(idd).get();

      if (isExist.data() != null) {
        const snapshot = await Users.where("idd", "==", idd).get();
        const uid = snapshot.docs.map((doc) => doc.id);
        Users.doc(uid[0]).update({
          idd: idd,
          userid: userid,
          name: name,
          city: city,
          country: country,
        })

        res.send({
          message: "Welcome to dashboard",
        });
      } else {
        res.send({
          message: "Something wrongs",
        });
      }
    } catch (e) {
      console.log(e.message);
      res.send({
        message: "Something wrong",
      });
    }
  };
}

module.exports = UserController;
