module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        //id mysql에서 자동으로 넣어줌
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    },{
        
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // 이모티콘 저장
       
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);//post.addComments
        db.Post.hasMany(db.Image);//post.addImages
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag'});
        db.Post.belongsToMany(db.User, { through : 'Like', as : 'Likers'});// post.addLikers, post.removeLikers 가 생성
        db.Post.belongsTo(db.Post, { as : 'Retweet' });//post.addRetweet
    }
    return Post;
}