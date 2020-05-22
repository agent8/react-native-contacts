/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    Alert,
} from "react-native";
import Contacts from "react-native-contacts";
import ListItem from "./components/ListItem";
import Avatar from "./components/Avatar";
import SearchBar from "./components/SearchBar";
import { addToContacts, addToBlocklist } from "./methods";
export default class App extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);

        this.state = {
            contacts: [],
            contact: {},
            searchPlaceholder: "Search",
        };

        // if you want to read/write the contact note field on iOS, this method has to be called
        // WARNING: by enabling notes on iOS, a valid entitlement file containing the note entitlement as well as a separate
        //          permission has to be granted in order to release your app to the AppStore. Please check the README.md
        //          for further information.
        // Contacts.iosEnableNotesUsage(true);
    }

    async componentWillMount() {
        if (Platform.OS === "android") {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: "Contacts",
                message: "This app would like to view your contacts.",
            }).then(() => {
                this.loadContacts();
            });
        } else {
            this.loadContacts();
        }
    }

    loadContacts() {
        Contacts.getAll((err, contacts) => {
            if (err === "denied") {
                console.warn("Permission to access contacts was denied");
            } else {
                this.setState({ contacts });
            }
        });

        Contacts.getCount((count) => {
            this.setState({ searchPlaceholder: `Search ${count} contacts` });
        });
    }

    search(text) {
        const phoneNumberRegex = /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
        const emailAddressRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (text === "" || text === null) {
            this.loadContacts();
        } else if (phoneNumberRegex.test(text)) {
            Contacts.getContactsByPhoneNumber(text, (err, contacts) => {
                this.setState({ contacts });
            });
        } else if (emailAddressRegex.test(text)) {
            Contacts.getContactsByEmailAddress(text, (err, contacts) => {
                this.setState({ contacts });
            });
        } else {
            Contacts.getContactsMatchingString(text, (err, contacts) => {
                this.setState({ contacts });
            });
        }
    }

    addContact = () => {
        addToContacts("wangliang1124@163.com", "王亮");
    };

    blockContact = () => {
        addToBlocklist(15893009511);
    };

    getContact = () => {
        Contacts.getContactsByEmailAddress("wangliang1124@163.com", (error, contacts) => {
            console.log("===getContactsByEmailAddress===", contacts);
            let item = contacts.find((item) => item.givenName === "王亮");
            this.setState({
                contact: item,
            });
            Alert.alert("contact info", JSON.stringify(item));
        });
    };

    updateContact = () => {
        Contacts.updateContact(
            {
                ...this.state.contact,
                urlAddresses: [{ label: "linkedinTest", url: "www.test.com" }],
                socialProfiles: [
                    {
                        label: "twitter",
                        value: {
                            urlString: "http://twitter.com/leon",
                            service: "Twitter",
                            username: "Leon",
                        },
                    },
                ],
            },
            (error, contacts) => {
                console.log("===updateContact===", error, contacts);
            }
        );
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View
                    style={{
                        paddingLeft: 100,
                        paddingRight: 100,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={require("./logo.png")}
                        style={{
                            aspectRatio: 6,
                            resizeMode: "contain",
                        }}
                    />
                </View>
                <SearchBar searchPlaceholder={this.state.searchPlaceholder} onChangeText={this.search} />
                <View style={styles.button}>
                    <Button onPress={this.addContact} title="Add New Contact" />
                </View>
                {/* <View style={{ height: 4 }}></View>
                <View style={styles.button}>
                    <Button onPress={this.blockContact} title="Block Contact" style={styles.button} />
                </View> */}
                <View style={{ height: 4 }}></View>
                <View style={styles.button}>
                    <Button onPress={this.getContact} title="Get Contact" style={styles.button} />
                </View>
                <View style={{ height: 4 }}></View>
                <View style={styles.button}>
                    <Button
                        onPress={this.updateContact}
                        title="Update Contact(先点get Contact)"
                        style={styles.button}
                    />
                </View>
                <ScrollView style={{ flex: 1 }}>
                    {this.state.contacts.map((contact) => {
                        return (
                            <ListItem
                                leftElement={
                                    <Avatar
                                        img={contact.hasThumbnail ? { uri: contact.thumbnailPath } : undefined}
                                        placeholder={getAvatarInitials(`${contact.givenName} ${contact.familyName}`)}
                                        width={40}
                                        height={40}
                                    />
                                }
                                key={contact.recordID}
                                title={`${contact.givenName} ${contact.familyName}`}
                                description={`${contact.company}`}
                                onPress={() => Contacts.openExistingContact(contact, () => {})}
                                onDelete={() =>
                                    Contacts.deleteContact(contact, () => {
                                        this.loadContacts();
                                    })
                                }
                            />
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        backgroundColor: "#ccc",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ccc",
    },
});

const getAvatarInitials = (textString) => {
    if (!textString) return "";

    const text = textString.trim();

    const textSplit = text.split(" ");

    if (textSplit.length <= 1) return text.charAt(0);

    const initials = textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);

    return initials;
};
