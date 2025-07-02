document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    // Here, you can add your logic for handling login.
    // For demonstration, let's log them to the console.
    console.log('Username:', username);
    console.log('Password:', password);

    // Add actual login logic here, such as sending data to a backend server.
});