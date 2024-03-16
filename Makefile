docker-sport-wizzard-base:
	cd sport-wizard-base; docker build -t sport-wizzard-base .

docker: docker-sport-wizzard-base
	docker build -t sport-wizzard .
