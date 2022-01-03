const Yup = require("yup");
const captchapng = require("captchapng");
const Blog = require("../models/Blog");
const { sendEmail } = require("../utils/mailer");

let CAPTCHA_NUM;

exports.getIndex = async (req, res) => {
    try {
        const numberOfPosts = await Blog.find({
            status: "public",
        }).countDocuments();

        const posts = await Blog.find({ status: "public" }).sort({
            createdAt: "desc",
        });

        res.status(200).json({ posts, total: numberOfPosts });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate(
            "user"
        );

        if (!post) return res.status(404).json({ message: "Not Found" });

        res.status(200).json({ post });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

exports.handleContactPage = async (req, res) => {
    const errorArr = [];

    const { fullname, email, message } = req.body;

    const schema = Yup.object().shape({
        fullname: Yup.string().required("نام و نام خانوادگی الزامی می باشد"),
        email: Yup.string()
            .email("آدرس ایمیل صحیح نیست")
            .required("آدرس ایمیل الزامی می باشد"),
        message: Yup.string().required("پیام اصلی الزامی می باشد"),
    });

    try {
        await schema.validate(req.body, { abortEarly: false });

        sendEmail(
            email,
            fullname,
            "پیام از طرف وبلاگ",
            `${message} <br/> ایمیل کاربر : ${email}`
        );

        res.status(200).json({ message: "پیام شما با موفقیت ارسال شد" });
    } catch (err) {
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
        res.status(422).json({ error: errorArr });
    }
};

exports.getCaptcha = (req, res) => {
    CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
    const p = new captchapng(80, 30, CAPTCHA_NUM);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    const img = p.getBase64();
    const imgBase64 = Buffer.from(img, "base64");

    res.send(imgBase64);
};
