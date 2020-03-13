import Contacts from "react-native-contacts";

export async function addToContacts(email, name) {
    return new Promise((resolve, reject) => {
        const contactObject = {
            emailAddresses: [
                {
                    label: "home",
                    email: email,
                },
            ],
        };

        const splitName = name.split(" ");
        if (splitName.length === 2) {
            contactObject.givenName = splitName[0];
            contactObject.familyName = splitName[1];
        } else {
            contactObject.givenName = name;
        }
        Contacts.openContactForm(contactObject, (err, contact) => {
            if (err) {
                resolve(err);
            } else {
                resolve(contact);
            }
        });
    });
}
