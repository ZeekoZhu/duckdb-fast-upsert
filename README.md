# duckdb-fast-upsert

Steps to reproduce:

```bash
yarn install
yarn start
# the process crashed
```

### Try the dotnet client

```bash
podman run --rm -it -v .:/app --platform linux/amd64 -t mcr.microsoft.com/dotnet/sdk:9.0 bash
# inside the container
cd ./dotnet/DuckDBFastUpsert
dotnet run
```
