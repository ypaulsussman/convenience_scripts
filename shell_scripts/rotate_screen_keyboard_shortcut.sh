# This script should correctly detect the current orientation and toggle between landscape and portrait (right) orientations. 

#  1. You have one connected display: `eDP-1`, which is your primary display. This is typical for a laptop's built-in screen.

# 2. The initial orientation of your screen is normal (landscape): 
#    `eDP-1 connected primary 1366x768+0+0 (normal left inverted right x axis y axis) 309mm x 173mm`

# Below is a refresher on how to use this script...

#!/bin/bash

# Get the primary display
display=$(xrandr | grep " connected primary" | cut -d " " -f1)

# If no primary display found, use the first connected display
if [ -z "$display" ]; then
    display=$(xrandr | grep " connected" | head -n 1 | cut -d " " -f1)
fi

# Get the current orientation
current=$(xrandr --query --verbose | grep "$display" | awk '{print $6}')

echo "Debug Info:"
echo "Display: $display"
echo "Current orientation: $current"

# Rotate the screen based on the current orientation
if [ "$current" = "normal" ]; then
    xrandr --output "$display" --rotate right
    echo "Rotated to portrait (right)"
elif [ "$current" = "right" ]; then
    xrandr --output "$display" --rotate normal
    echo "Rotated to landscape"
else
    xrandr --output "$display" --rotate normal
    echo "Rotated to landscape (from an unknown orientation)"
fi

# Print the new orientation after rotation
new_current=$(xrandr --query --verbose | grep "$display" | awk '{print $6}')
echo "New orientation: $new_current"

# 1. Open the script in your text editor:
#    ```
#    nano ~/.local/bin/rotate-screen.sh
#    ```

# 2. Replace the entire content with the script above.

# 3. Save and exit (Ctrl+X, then Y, then Enter in nano).

# Now, when you run the script (`~/.local/bin/rotate-screen.sh`), it should correctly toggle between landscape and portrait orientations. Try running it multiple times to confirm that it switches back and forth as expected.

# If you encounter any issues or unexpected behavior with this updated script, please let me know, and we can further refine it.

# ...and here's a refresher on to add a hotkey to run the script in Ubuntu:

# 1. Open the Settings application:
#    - Click on the "Activities" overview in the top-left corner of your screen, or press the Super (Windows) key.
#    - Type "Settings" and click on the Settings app.

# 2. Navigate to the Keyboard Shortcuts:
#    - In the Settings window, scroll down and click on "Keyboard" in the left sidebar.
#    - In the Keyboard settings, click on "View and Customize Shortcuts" at the bottom.
#    - Scroll down to the bottom and click on "Custom Shortcuts".

# 3. Add a new custom shortcut:
#    - Click the "+" button at the bottom of the Custom Shortcuts section.
#    - In the "Add Custom Shortcut" dialog that appears:
#      - Name: Enter "Toggle Screen Rotation" (or any name you prefer)
#      - Command: Enter the full path to your script: `/home/yourusername/.local/bin/rotate-screen.sh`
#        (Replace 'yourusername' with your actual username)
#    - Click "Add"

# 4. Set the keyboard shortcut:
#    - After adding the custom shortcut, it will appear in the list with "Disabled" next to it.
#    - Click on "Disabled" and you'll see "New accelerator..." 
#    - Press the key combination you want to use (e.g., Ctrl+Alt+R)

# 5. Test the shortcut:
#    - Press the key combination you just set.
#    - Your screen should rotate between landscape and portrait orientations each time you use the shortcut.

# Remember, you can always change this shortcut later by coming back to this same section in the Settings.

# Now you should be able to rotate your screen with just a keypress! Let me know if you have any trouble setting this up or if you'd like to make any further modifications to the script or its functionality.