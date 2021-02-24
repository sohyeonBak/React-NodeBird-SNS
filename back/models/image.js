module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        //id mysql에서 자동으로 넣어줌
        src: {
            type: DataTypes.STRING(200),
            allowNull: false,
        }
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    });
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post)
    }
    return Image;

}