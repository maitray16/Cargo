import unittest
import coverage
from flask.cli import FlaskGroup
from project import create_app

app = create_app()
cli = FlaskGroup(create_app=create_app)

COVERAGE = coverage.coverage(
    branch=True,
    include='project/*',
    omit=[
        'project/tests/*',
        'project/config.py',
    ])
COVERAGE.start()


@cli.command()
def test():
    """Run Tests without coverage"""
    tests = unittest.TestLoader().discover(
        './project/tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@cli.command()
def cov():
    tests = unittest.TestLoader().discover('project/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COVERAGE.stop()
        COVERAGE.save()
        print('Coverage Summary:')
        COVERAGE.report()
        COVERAGE.html_report()
        COVERAGE.erase()
        return 0


if __name__ == '__main__':
    cli()
