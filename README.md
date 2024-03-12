# Build a real-time dashboardd over Kafka

Follow the steps below to build and optimize a real-time analytics dashboard over Kafka data using Tinybird and Grafana.

> :tv: You can watch me build this [on YouTube](https://www.youtube.com/watch?v=WXABIUMYzM0).

### Prerequisites

- A [Confluent Cloud](https://confluent.io) topic.
- Node.js

## Instructions

Follow these instructions to deploy this real-time Grafana dashboard.

### 0. Create a free Tinybird Workspace

First, create a [free Tinybird account](https://www.tinybird.co/signup). Then create a new Workspace when prompted. You can name it whatever you want.

### 1. Clone the repository

```sh
git clone https://github.com/tinybirdco/demo-real-time-kafka-dashboard.git
cd demo-real-time-kafka-dashboard
```

### 2. Install the Tinybird CLI and dependencies

```sh
cd tinybird
python -mvenv .e
. .e/bin/activate
pip install tinybird-cli confluent_kafka
```

### 3. Authenticate to Tinybird

Copy your User Admin Token from the Tinybird UI. Your user admin token is the token with the format admin <your email address>.

From the `/tinybird` directory, run the following command:

```sh
export TB_TOKEN=<your user admin token>
TB auth
```

### 4. Install the Mockingbird CLI

This project uses [Mockingbird](https://mockingbird.tinybird.co), a FOSS streaming data generator built by Tinybird. The data generation script utilizes the Mockingbird CLI.

```sh
npm install -G @tinybirdco/mockingbird-cli
```

> :warning: Your token and workspace details will be stored in a .tinyb file. If you intend to push this to a public repository, add the `.tinyb` to your `.gitignore`.

### 4. Update the data generator with your Confluent details

This demo uses Confluent Cloud to handle data streaming. If you're new to Confluent, you can signup for an account [here](https://www.confluent.io/get-started). We use a bash script to generate fake data using Mockingbird and send it to Confluent Cloud. You'll need to update the `generate.sh` file with your Confluent details:

```sh
mockingbird-cli confluent-cloud-kafka --schema "schema.json" --eps $1 --restEndpoint <your rest endpoint> --clusterId <your cluster id> --topic <your topic name> --apiKey <your api key> --apiSecret <your api secret>
```

### 5. Start streaming data to Confluent

Use the data generator to start streaming data to your Confluent topic. The script accepts a single argument for the number of events per second you want to send:

```sh
. ./generat.sh 50 #send 50 events per second
```

### 6. Create the Confluent Data Source in Tinybird.

Open the `events.datasource` file in `/tinybird/datasources`. Update lines 13-18 with your Confluent Connection details and uncomment:

```sh
KAFKA_CONNECTION_NAME my_connection_name
KAFKA_BOOTSTRAP_SERVERS my_server:9092
KAFKA_KEY my_username
KAFKA_SECRET my_password
KAFKA_TOPIC my_topic
KAFKA_GROUP_ID my_group_id
```

For more information on connecting to Confluent, check out the [Confluent Connector docs](https://www.tinybird.co/docs/ingest/confluent.html).

### 7. Push the resources to Tinybird

Push all of the resources in the `/tinybird` directory to the Tinybird server.

```sh
cd tinybird
tb push --force
```

### 8. Check your APIs

You'll have three APIs, each with various levels of optimizations:

- `sessions.pipe`
- `sessions_time_range.pipe`
- `sessions_rollups.pipe`

You can use these three different pipes to see the differences in dashboard performance. To check that these are returning valid results, navigate to your Tinybird Workspace in the UI, find the Pipe, and click View API. You can see sample usage that should show a result.

Alternatively, you can use a `curl` to check it:

```sh
export TB_HOST = <your api host e.g. https://api.us-east.tinybird.co>
curl --compressed -H 'Authorization: Bearer $TB_TOKEN $TB_HOST/v0/pipes/sessions.json
```

### 9. Install Grafana Local

You can use homebrew to install Grafana Local:

```sh
brew update
brew install grafana
brew start grafana
```

For more install options, check out [the docs](https://grafana.com/docs/grafana/latest/setup-grafana/installation/).

By default, Grafana runs on http://localhost:3000. Open it and log in.

### 10. Create a Grafana Data Source

This project uses the [JSON API Data Source Plugin](https://grafana.com/grafana/plugins/marcusolsson-json-datasource/) for Grafana.

Follow [this documentation](https://www.tinybird.co/docs/guides/consume-api-endpoints-in-grafana.html) for details on how to create a JSON API Data Source for your Tinybird Endpoints in Grafana.

### 11. Update the Grafana dashboard file

Edit the `dashboard.json` file in the `/grafana` folder. Update the Data Source UID wherever it is mentioned to match the UID of the Data Source you created in the prior step:

```json
"datasource": {
        "type": "marcusolsson-json-datasource",
        "uid": "<your_UID>"
      },
```

### 12. Open the dashboard!

You should now have a functioning real-time dashboard!

## Contributing

If you find any issues or have suggestions for improvements, please submit an issue or a [pull request](https://github.com/tinybirdco/demo-real-time-kafka-dashboard/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc).

## License

This code is available under the MIT license. See the [LICENSE](https://github.com/tinybirdco/demo-real-time-kafka-dashboard/blob/main/LICENSE.txt) file for more details.

## Need help?

&bull; [Community Slack](https://www.tinybird.co/community) &bull; [Tinybird Docs](https://www.tinybird.co/docs) &bull;

## Authors

- [Cameron Archer](https://github.com/tb-peregrine)
