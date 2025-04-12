format:
	npx prettier --write .

lint:
	npm run lint

check: format lint

dev: 
	npx tauri dev