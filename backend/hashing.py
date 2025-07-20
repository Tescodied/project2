import bcrypt

password = b""
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password, salt)

print(hashed)
