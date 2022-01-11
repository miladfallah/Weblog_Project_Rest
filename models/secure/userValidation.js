const Yup = require("yup");
require('yup-password')(Yup);

exports.schema = Yup.object().shape({
    fullname: Yup.string()
        .required("نام و نام خانوادگی الزامی می باشد")
        .min(4, "نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد")
        .max(255, "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد"),
    email: Yup.string()
        .email("ایمیل معتبر نمی باشد")
        .required("ایمیل الزامی می باشد"),
    password: Yup.string()
        .min(8, "کلمه عبور نباید کمتر از 4 کاراکتر باشد")
        .max(16, "کلمه عبور نباید بیشتر از 16 کاراکتر باشد")
        .required("کلمه عبور الزامی می باشد")
        .minLowercase(1, "رمز عبور باید حداقل دارای یک حرف کوچک باشد.")
        .minUppercase(1, "رمز عبور باید حداقل دارای یک حرف بزرگ باشد.")
        .minNumbers(1, "رمز عبور باید حداقل دارای یک عدد باشد.")
        .minSymbols(1, "رمز عبور باید حداقل دارای یک علامت باشد."),
    confirmPassword: Yup.string()
        .required("تکرار کلمه عبور الزامی می باشد")
        .oneOf([Yup.ref("password"), null], "کلمه های عبور یکسان نیستند"),
});
