#!/bin/bash
#  Make sure to use the prefix MY_APP_.
#If you have any other prefix in env.production file variable name replace it with MY_APP_.
for i in $(env | grep MY_APP_); do
	key=$(echo "${i}" | cut -d '=' -f 1)
	value=$(echo "${i}" | cut -d '=' -f 2-)
	echo "${key}"="${value}"

	# Replaced hardcoded values with value of env variable injected at runtime.
	find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done
