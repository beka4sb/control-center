load("@npm//:start-server-and-test/package_json.bzl", ssat = "bin")

def e2e_test(**kwargs):
    name = kwargs.pop("name")
    srcs = kwargs.pop("srcs")

    ssat.start_server_and_test_test(
        name = name,
        data = srcs + [
            ":cypress.config.ts",
            "cypress-reporter.config.json",
            "//saq/pqc/control-center:start-test",
            ":cypress",
        ],
        env = {
            "DEBUG": "start-server-and-test",
            "NEXT_PUBLIC_WS_ENDPOINT": "ws://localhost:8000/ws",
        },
        args = [
            "'$(location //saq/pqc/control-center:start-test) serve --config webpack.test.js --no-open'",
            "http://127.0.0.1:3000",
            "'$(location :cypress) run --project=.. --config-file=cypress/cypress.config.ts'",
        ],
        **kwargs
    )
