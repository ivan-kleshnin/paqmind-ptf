# Paqmind-PTF

Create `dev.env`, filling the credentials as necessary:

```
export GITHUB_TOKEN=???
```

## Log of the steps, taken

### Step-0

```
@ download db1.csv from Google Drive 
$ . dev.env 
```

### Step-1

```
$ cat db0.csv | node src/1.reformat.js > db1.csv
```

### Step-2

```
$ cat db1.csv 1 | pv -q -L 1k | node src/2.scrape.js > db2.csv -- throttle up to 1Kib per second
```

### Step-3

```
$ node src/3.scrape-more.js | tail -n +2 >> db2.csv -- append to db2.csv without header
```
