#!/usr/bin/python

import getopt
import os.path
import re
import sys

# Global variables we'll abuse and reuse
line_counter = 0
inputfile = ''
filecontents = ''
variables = {}


# Regex definitions
varname = "\$[a-zA-Z]+"
groupname = "[A-Z_\-\.]"

var_name = re.compile(varname)
var_instantiation = re.compile("(" + varname + ")\s?=\s?\"(.+)\"")


# Functions
def loadfile(path):
    with open(path) as f:
        return f.read().splitlines()

def createvariable(result):
    global variables

    variables[result.group(1)] = result.group(2)

def getvariable(name):
    global line_counter

    try:
        return variables[name]
    except:
        print "Fatal: Variable", name, "was not previously initialized on line", line_counter
        sys.exit(2)

def parsevariables(line):
    variables = re.findall(var_name, line)

    for var in variables:
        value = getvariable(var)
        line = line.replace(var, value)

    return line


# Setup getopt
try:
    opts, args = getopt.getopt(sys.argv[1:], "hi:", ["file="])
except getopt.GetoptError:
    print 'bzgdbc.py -i <inputfile>'
    sys.exit(2)

for opt, arg in opts:
    if opt == '-h':
        print 'bzgdbc.py -i <inputfile> -o <outputfile>'
        sys.exit()
    elif opt in ("-i", "--file"):
        inputfile = arg


# Attempt to find the file and load it
if not os.path.isfile(inputfile):
    print 'File not found'
    sys.exit(2)

filecontents = loadfile(inputfile)


# Main loop
for line in filecontents:
    line_counter = line_counter + 1

    if line[:1] == "#":
        continue
    elif var_instantiation.match(line):
        vardata = re.search(var_instantiation, line)
        createvariable(vardata)
        continue

    if var_name.match(line):
        line = parsevariables(line)
