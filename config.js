var db = process.env.DATABASE_URL || 'postgres://fgoncalves:pafu2ncia@localhost:5432/emprego_development';

module.exports = {
    'secret': 'ilovescotchyscotch',
    'database': db
};
