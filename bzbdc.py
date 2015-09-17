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
groups = {}


# Regex definitions
varname = "\$[a-zA-Z]+"
groupname = "[A-Z_\-\.]+"
comment = "\s*?#.*"

var_name = re.compile("(" + varname + ")")
comment_line = re.compile(comment)
var_instantiation = re.compile("(" + varname + ")\s?=\s?\"(.+)\"")
group_declaration = re.compile("(" + groupname + ")")


# Functions
def loadfile(path):
    try:
        with open(path) as f:
            return f.read().splitlines()
    except IOError:
        print "bzgrpc: " + path + ": No such file"
        sys.exit(2)

def set_variable(name, value):
    global variables

    variables[name] = value

def get_variable(name):
    global line_counter

    try:
        return variables[name]
    except:
        raise NameError('Variable {} was not previously initialized'.format(name))

def evaluate_variables(line):
    variables = re.findall(var_name, line)

    for var in variables:
        value = get_variable(var)
        line = line.replace(var, value)

    return line

def create_group_if_not_exist(group_name):
    global groups

    if not group_name in groups:
        groups[group_name] = []

    return group_name

def handle_permission(group, perm):
    global groups

    action = perm[:1]
    perm_name = perm[1:]

    add_perm = "+" + perm_name
    remove_perm = "-" + perm_name
    negate_perm = "!" + perm_name

    if action == "+":
        try:
            groups[group].remove(remove_perm)
        except:
            pass
    elif action == "-":
        try:
            groups[group].remove(add_perm)
        except:
            pass
    elif action == "!":
        try:
            groups[group].remove(remove_perm)
            groups[group].remove(add_perm)
        except:
            pass

    if negate_perm not in groups[group] and perm not in groups[group]:
        groups[group].append(perm)

def parse(filepath):
    filecontents = loadfile(filepath)
    line_counter = 0
    last_group = ""

    for line in filecontents:
        line_counter = line_counter + 1

        if line.isspace() or len(line) == 0:
            continue

        if comment_line.search(line) is not None:
            continue
        elif var_instantiation.match(line):
            vardata = re.search(var_instantiation, line)
            name = vardata.group(1)
            value = vardata.group(2)

            set_variable(name, value)
            continue

        if var_name.search(line) is not None:
            try:
                line = evaluate_variables(line)
            except NameError, e:
                print str(e), "on line", line_counter, "of file:", filepath
                sys.exit(2)

        if group_declaration.match(line):
            last_group = create_group_if_not_exist(line)
            continue

        line = line.strip()

        if line[:1] == "+" or line[:1] == "-" or line[:1] == "!":
            handle_permission(last_group, line)
        elif line[:1] == "@":
            tokens = line.split(" ")
            func_call = tokens[0][1:]

            if len(tokens) >= 1:
                params = tokens[1:]
            else:
                params = None

            params.insert(0, last_group)

            try:
                functions[func_call](params)
            except KeyError:
                print "Undefined function @" + func_call + " on line", line_counter, "of file:", filepath
                sys.exit(2)


# Language functions
def func_include(file_path):
    global line_counter

    file_path = file_path[1]

    try:
        parse(file_path)
    except IOError:
        print "Fatal: Included file '" + file_path + "' not found on line", line_counter
        sys.exit(2)

def func_extend(params):
    global groups
    global line_counter

    target_group = params[0]
    extend_group = params[1]

    for perm in groups[extend_group]:
        handle_permission(target_group, perm)

functions = {
    'include': func_include,
    'extend': func_extend
}


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


# Load the initial file
parse(inputfile)

print groups
