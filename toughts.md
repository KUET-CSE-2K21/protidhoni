>add a option to get live hash of the source files
# Data security model:
any personal data will be stored encrypted on the database. (server admin and the host will only have the key) AES encryption
phone numbers and other sensitive information(phone no,guardian's phone no,emergency info) will be encrypted twice:
1. the general aes
2. rsa encryption
the public key will be available to the server admin and the host .
And someone elected/selected as the most reliable or trusted person will have the secret key..
In case of any emergency the trusted person holds the responsibility to decrypt the required sensitive information.
every attempt on accessing sensitive data will be properly audited

probable threat : server admin/  host shares the encrypted data with the trusted person (prob sol: 2 trusted persons with 2 diff keys)