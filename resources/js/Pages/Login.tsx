import { useState, FormEventHandler } from "react";
import { Head, useForm } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEye,
    faEyeSlash,
    faAt,
} from "@fortawesome/free-solid-svg-icons";

export default function Login({ errors }: { errors: Record<string, string> }) {
    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
        reset,
    } = useForm({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(typeof route !== "undefined" ? route("login") : "/login", {
            onFinish: () => reset("password"),
        });
    };

    const hasErrors = Object.keys(formErrors).length > 0;

    return (
        <div className="p-0 m-0 font-sans bg-[#f3eeea] bg-[url('/loginBackground.png')] bg-cover h-[100dvh] w-[100dvw] overflow-hidden relative">
            <Head title="Login" />

            <div className="w-[90%] max-w-[58rem] border border-[#d1d5db] bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] h-[90%] min-[801px]:h-[38rem] rounded-[10px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col min-[801px]:flex-row overflow-hidden gap-[15px]">
                <div className="hidden min-[801px]:flex w-[739px] h-full justify-center overflow-hidden bg-[#dfdad5]">
                    <img
                        src="/banner.png"
                        alt="garisKotaBanner"
                        className="h-full block"
                    />
                </div>

                <div className="w-full h-full flex justify-center">
                    <form
                        onSubmit={submit}
                        className="w-[90%] lg:w-[75%] p-[20px] flex flex-col justify-center items-center gap-[10px]"
                    >
                        <div className="w-[9rem] flex justify-center">
                            <img
                                src="/logoRed.png"
                                alt="logo"
                                className="w-full h-auto object-cover block"
                            />
                        </div>

                        <div className="flex flex-col mb-[20px] max-w-[80%] text-center gap-[5px]">
                            <h2 className="m-0 font-['Jua',sans-serif] text-[24px] text-[#97461e]">
                                WELCOME BACK
                            </h2>
                            <p className="m-0 text-[14px] text-[#6b7280]">
                                Enter your details to get sign in to your
                                account
                            </p>
                        </div>

                        <div className="flex flex-col gap-[8px] w-full">
                            <label
                                htmlFor="email"
                                className="text-[14px] text-[#374151]"
                            >
                                Email address
                            </label>
                            <div className="relative flex items-center w-full">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                    className="w-full h-[38px] pl-[15px] pr-[45px] py-0 rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c]"
                                />
                                <span className="absolute right-[15px] text-[#b91c1c] text-[18px] cursor-pointer w-[20px] flex justify-center">
                                    <FontAwesomeIcon icon={faAt} />
                                </span>
                            </div>
                            {hasErrors && (
                                <div className="text-red-600">
                                    {Object.values(formErrors).map(
                                        (error, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[12px] text-red-600 block"
                                            >
                                                {error}
                                            </span>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-[8px] w-full">
                            <label
                                htmlFor="password"
                                className="text-[14px] text-[#374151]"
                            >
                                Password
                            </label>
                            <div className="relative flex items-center w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                    className="w-full h-[38px] pl-[15px] pr-[45px] py-0 rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c]"
                                />
                                <span
                                    id="passwordLogo"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-[15px] text-[#b91c1c] text-[18px] cursor-pointer w-[20px] flex justify-center"
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                    />
                                </span>
                            </div>
                        </div>

                        <button
                            id="submitButton"
                            type="submit"
                            disabled={processing}
                            className="w-full h-[38px] px-[12px] py-[10px] rounded-[5px] border-0 bg-[#be1a1a] text-white text-[14px] font-inherit cursor-pointer transition-colors duration-100 ease-in-out hover:bg-[#93000b] flex items-center justify-center disabled:opacity-50"
                        >
                            {processing ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
