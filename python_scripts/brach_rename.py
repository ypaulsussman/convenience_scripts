import os
import re

path = '/home/ysuss/Music/Brach_Meditation'
caret = "√ "
for filename in os.listdir(path):
  if re.match(caret, filename):
    os.rename(os.path.join(path, filename), 
                os.path.join(path, re.sub(caret,'',filename)))

