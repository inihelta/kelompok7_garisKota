<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        @vite(['resources/css/login.css'])
        <!-- Tambahkan FontAwesome untuk Ikon -->
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <title>Login</title>
    </head>
    <body>
        <div class="login-container">
            <div class="login-box left">
                <img src="banner.png" alt="garisKotaBanner" />
            </div>

            <div class="login-box right">
                <form class="login-form" action="" method="POST">
                    @csrf

                    <div class="logo">
                        <img src="logoRed.png" alt="logo" />
                    </div>

                    <div class="login-header">
                        <h2 class="login-title">WELCOME BACK</h2>
                        <p class="login-subtitle">
                            Enter your details to get sign in to your account
                        </p>
                    </div>

                    <div class="input-group">
                        <label for="email">Email address</label>
                        <div class="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                            />
                            <i class="fa-solid fa-user icon"></i>
                        </div>
                    </div>

                    <div class="input-group">
                        <label for="password">Password</label>
                        <div class="input-wrapper">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                            />
                            <i class="fa-solid fa-eye icon"></i>
                        </div>
                    </div>
                    <button type="submit" class="login-btn">Login</button>
                </form>
            </div>
        </div>
    </body>
</html>
