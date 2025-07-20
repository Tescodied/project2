import bcrypt

password = b"Men12345"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password, salt)

print(hashed)
