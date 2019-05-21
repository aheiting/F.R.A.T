# F.R.A.T.

This file will read the pictures of a given directory as students and once one of these faces are deteced it will send the name of the file and the time stamp to the website.

## Getting Started


### Prerequisites

Python2.7
linux OS

for taking pictures i recomened using camorama
```
sudo apt-get install camorama
```

### Installing with Personal VM

first download the face recognition software


```
pip3 install face_recognition
```

Next, download opencv

```
sudo apt-get install python-opencv
```

###Attach camera from windows machine to vm

First navigate to your virtualbox applications folder


```
cd C:\Program Files\Oracle\VirtualBox>
```

next check for webcams


```
VBoxManage.exe list webcams
```
Example of output

```
Video Input Devices: 1
.1 "HD User Facing"
\\?\usb#vid_0408&pid_a061&mi_00#6&f1d4efc&0&0000#{65e8773d-8f56-11d0-a3b9-00a0c9223196}\global
```

Attach webcam i'm using 1 because in the previous example that is the device number

```
VBoxManage.exe controlvm (directory) webcam attach .1
```

lastly make sure that under devices webcam is checked in VM0
### If VM Installed

go to the Downloads folder and run webcam.py

```
python webcam.py
```
