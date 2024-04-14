# Daktronics DMP

Daktronics DMP v1.0.1<br>
4/14/2024<br>
Eddie Wettach <ewettach@gmail.com>

## Change Log

1.0.1 - Bug fix with manifest to support version 3.1+ of Companion
1.0.0 - Initial support for Daktronics DMP - blanking display zones and playing files in display zones

### Requirements:

1.  Companion
2.  Daktronics DMP (tested with DMP 8000)

### How to:

1.  Add an instance of Daktronics DMP to Companion.
2.  Configure the IP address or hostname of the DMP \*
3.  Configure the port number to access the DMP (default is 4502) \*
4.  If desired enter the default path of files stored on the DMP and the default Zone ID (more on this in the Optional Settings section)
5.  Configure a button with the action to play file or blank display and fill out needed text input boxes

- In order to send commands you may have to configure port forwarding on a router if there is one between the machine running Companion and the DMP

### Actions:

Allows user to control DMP by playing files and blanking display

---

#### Blank Display:

Command for blacking a zone on the display

##### Parameters:

- **Absolute filepath and filename**: The path and filename of the file desired to be played
- **Relative filepath and filename**: The path and filename of the file desired to be played relative to the default path in settings
- **Zone ID**: The name of zone (i.e. <i>primary/Full Screen Takeover Zone</i>, <i>primary/Video Zone</i>)

---

#### Play File

Command for playing out a file stored on the DMP

##### Parameters:

- **Zone ID**: The name of zone (i.e. <i>primary/Full Screen Takeover Zone</i>, <i>primary/Video Zone</i>)
- **Channel**: The channel (preview, live1, or live2) that you want the trigger to output on

---

#### Files

For live video playback, you may need to set the file path to something like the path below<br>
<i>C:\\Documents and Settings\\All Users\\Application Data\\Daktronics\\VNet4\\Content\\system\\devices\\capture.dpf</i>
