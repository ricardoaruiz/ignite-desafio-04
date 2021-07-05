import React from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodType } from 'types/foods';

const editingFoodInitialState: FoodType = {
  name: '',
  description: '',
  image: '',
  available: true,
  price: 0
}

export const Dashboard = () => {
  const [foods, setFoods] = React.useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = React.useState<FoodType>(editingFoodInitialState);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  React.useEffect(() => {
    const loadFoods = async () => {
      const { data } = await api.get<FoodType[]>('/foods');
      setFoods(data);
    }
    loadFoods();
  }, [])


  const handleAddFood = async (food: FoodType) => {
    try {
      const { data } = await api.post<FoodType>('/foods', {
        ...food,
        available: true,
      });

      setFoods(state => ([ ...state, data ]))
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodType) => {
    try {
      const { data: foodUpdated} = await api.put<FoodType>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.id ? f : foodUpdated,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number | undefined) => {
    if (!id) return;
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(state => !state);
  }

  const toggleEditModal = () => {
    setEditModalOpen(state => !state);
  }

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  );
  
};

export default Dashboard;
