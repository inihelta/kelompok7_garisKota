<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        @vite(['resources/css/app.css', 'resources/js/login.js'])
        <!-- Tambahkan FontAwesome untuk Ikon -->
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <title>Login</title>
    </head>
    <body class="p-0 m-0 font-sans bg-[#f3eeea] h-[100dvh] w-[100dvw] overflow-hidden">
        <div class="w-[90%] max-w-[56rem] border border-[#d1d5db] bg-white shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] h-[90%] min-[801px]:h-[38rem] rounded-[10px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col min-[801px]:flex-row overflow-hidden gap-[15px]">
            <div class="hidden min-[801px]:flex w-[763px] h-full justify-center overflow-hidden bg-[#dfdad5]">
                <img src="banner.png" alt="garisKotaBanner" class="h-full block" />
            </div>

            <div class="w-full h-full flex justify-center">
                <form
                    class="w-[90%] p-[20px] flex flex-col justify-center items-center gap-[10px]"
                    method="POST"
                    action="{{ route('login') }}"
                >
                    @csrf

                    <div class="w-[9rem] flex justify-center">
                        <img src="logoRed.png" alt="logo" class="w-full h-auto object-cover block" />
                    </div>

                    <div class="flex flex-col mb-[20px] max-w-[80%] text-center gap-[5px]">
                        <h2 class="m-0 font-['Jua',sans-serif] text-[24px] text-[#97461e]">WELCOME BACK</h2>
                        <p class="m-0 text-[14px] text-[#6b7280]">
                            Enter your details to get sign in to your account
                        </p>
                    </div>

                    <div class="flex flex-col gap-[8px] w-full">
                        <label for="email" class="text-[14px] text-[#374151]">Email address</label>
                        <div class="relative flex items-center w-full">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value="{{ old('email') }}"
                                required
                                class="w-full h-[38px] pl-[15px] pr-[45px] py-0 rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c]"
                            />
                            <i class="fa-solid fa-user absolute right-[15px] text-[#b91c1c] text-[18px] cursor-pointer w-[20px] flex justify-center"></i>
                        </div>
                        @if ($errors->any())
                            <div class="text-red-600">
                                @foreach ($errors->all() as $error)
                                    <span class="text-[12px] text-red-600">{{ $error }}</span>
                                @endforeach
                            </div>
                        @endif
                    </div>

                    <div class="flex flex-col gap-[8px] w-full">
                        <label for="password" class="text-[14px] text-[#374151]">Password</label>
                        <div class="relative flex items-center w-full">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                class="w-full h-[38px] pl-[15px] pr-[45px] py-0 rounded-[8px] border border-[#d1d5db] text-[14px] outline-none text-[#4b5563] placeholder-[#9ca3af] focus:border-[#b91c1c]"
                            />
                            <i
                                id="passwordLogo"
                                class="fa-solid fa-eye absolute right-[15px] text-[#b91c1c] text-[18px] cursor-pointer w-[20px] flex justify-center"
                            ></i>
                        </div>
                    </div>

                    <button
                        id="submitButton"
                        type="submit"
                        class="w-full h-[38px] px-[12px] py-[10px] rounded-[5px] border-0 bg-[#be1a1a] text-white text-[14px] font-inherit cursor-pointer transition-colors duration-100 ease-in-out hover:bg-[#93000b] flex items-center justify-center"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    </body>
</html>
