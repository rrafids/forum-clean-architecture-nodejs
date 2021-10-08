/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
      default: new Date().toISOString(),
    },
  });

  /** memberikan constraint foreign key pada kolom thread_id dan user_id
      terhadap threads.id dan users.id */
  pgm.addConstraint(
    'thread_comments',
    'thread_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'thread_comments',
    'thread_comments.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('thread_comments');
};
